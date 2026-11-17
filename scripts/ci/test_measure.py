"""The timing wrapper must preserve failures, arguments, and cancellation."""

import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time
import unittest


MEASURE = Path(__file__).with_name("measure.py")


class MeasureTest(unittest.TestCase):
    def test_exit_status_and_literal_arguments(self):
        with tempfile.TemporaryDirectory() as directory:
            report = Path(directory) / "result.json"
            literal = "spaces ; $HOME $(false) 'quotes'"
            for code in (0, 7):
                result = subprocess.run([
                    sys.executable, str(MEASURE), "--output", str(report), "--",
                    sys.executable, "-c",
                    "import sys; assert sys.argv[1] == sys.argv[2]; sys.exit(int(sys.argv[3]))",
                    literal, literal, str(code),
                ], capture_output=True, text=True)
                data = json.loads(report.read_text())
                self.assertEqual(result.returncode, code, result.stderr)
                self.assertEqual(data["exitCode"], code)
                self.assertEqual(data["status"], "passed" if code == 0 else "failed")
                self.assertGreaterEqual(data["wallSeconds"], 0)
                self.assertGreaterEqual(data["cpuSeconds"], 0)

    def test_missing_command_replaces_stale_success(self):
        with tempfile.TemporaryDirectory() as directory:
            report = Path(directory) / "result.json"
            report.write_text('{"status":"passed"}')
            result = subprocess.run([
                sys.executable, str(MEASURE), "--output", str(report), "--",
                str(Path(directory) / "missing-executable"),
            ], capture_output=True, text=True)
            self.assertEqual(result.returncode, 127)
            self.assertEqual(json.loads(report.read_text())["status"], "failed")

    def test_cancellation_reaches_child(self):
        with tempfile.TemporaryDirectory() as directory:
            report = Path(directory) / "result.json"
            ready = Path(directory) / "ready"
            process = subprocess.Popen([
                sys.executable, str(MEASURE), "--output", str(report), "--",
                sys.executable, "-c",
                "import os,pathlib,signal,sys,time; signal.signal(signal.SIGTERM, lambda *_: sys.exit(0)); pathlib.Path(sys.argv[1]).write_text(str(os.getpid())); time.sleep(60)",
                str(ready),
            ], stdout=subprocess.DEVNULL)
            try:
                deadline = time.monotonic() + 10
                while not ready.exists() and time.monotonic() < deadline:
                    time.sleep(0.02)
                self.assertTrue(ready.exists())
                process.send_signal(signal.SIGTERM)
                self.assertEqual(process.wait(timeout=10), 143)
                self.assertEqual(json.loads(report.read_text())["status"], "failed")
                with self.assertRaises(ProcessLookupError):
                    os.kill(int(ready.read_text()), 0)
            finally:
                if process.poll() is None:
                    process.kill()
                    process.wait()


if __name__ == "__main__":
    unittest.main()
