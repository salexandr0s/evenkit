#!/usr/bin/env python3
"""Measure one command on Linux/macOS without changing its pass/fail result."""

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import platform
import resource
import signal
import subprocess
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("command", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    command = args.command[1:] if args.command[:1] == ["--"] else args.command
    if not command:
        parser.error("a command is required after --")

    report = {
        "schemaVersion": 1,
        "command": command,
        "revision": os.environ.get("GITHUB_SHA") or subprocess.check_output(
            ["git", "rev-parse", "HEAD"], text=True
        ).strip(),
        "dirty": bool(subprocess.check_output(
            ["git", "status", "--porcelain"], text=True
        ).strip()),
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "platform": platform.platform(),
        "loadAverageStart": list(os.getloadavg()),
        "status": "running",
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)

    def save():
        temporary = args.output.with_suffix(".tmp")
        temporary.write_text(json.dumps(report, indent=2) + "\n")
        temporary.replace(args.output)

    # An interrupted run must never leave a previous successful report behind.
    save()
    start = time.monotonic()
    before = resource.getrusage(resource.RUSAGE_CHILDREN)
    child = None
    interrupted = None

    def forward(signum, _frame):
        nonlocal interrupted
        interrupted = signum
        if child is not None:
            try:
                os.killpg(child.pid, signum)
            except ProcessLookupError:
                pass

    signal.signal(signal.SIGTERM, forward)
    signal.signal(signal.SIGINT, forward)
    try:
        child = subprocess.Popen(command, start_new_session=True)
        if interrupted is not None:
            forward(interrupted, None)
        result = child.wait()
        exit_code = 128 + interrupted if interrupted is not None else (
            result if result >= 0 else 128 - result
        )
    except OSError as error:
        report["error"] = str(error)
        exit_code = 127
    after = resource.getrusage(resource.RUSAGE_CHILDREN)
    report.update({
        "status": "passed" if exit_code == 0 else "failed",
        "exitCode": exit_code,
        "wallSeconds": round(time.monotonic() - start, 3),
        "loadAverageEnd": list(os.getloadavg()),
        "cpuSeconds": round(
            after.ru_utime + after.ru_stime - before.ru_utime - before.ru_stime, 3
        ),
    })
    save()
    print(json.dumps(report), flush=True)
    if summary := os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(summary, "a") as stream:
            stream.write(
                f"- {args.output.stem}: **{report['status']}**; "
                f"{report['wallSeconds']:.3f}s elapsed, "
                f"{report['cpuSeconds']:.3f}s process CPU.\n"
            )
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
