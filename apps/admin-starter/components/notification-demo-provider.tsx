"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { NotificationOperation } from "@evenkit/ui";
import type { NotificationPreferenceContext, NotificationPreferenceValue } from "../blocks/notification-preferences";
import { initialNotificationData, notificationOperationAllowed, type DemoNotificationData } from "../lib/demo-notifications";
import { useStarter } from "./starter-providers";

interface NotificationDemoContextValue {
  data: DemoNotificationData;
  commitOperation: (operation: NotificationOperation, revision: number) => void;
  commitPreferences: (value: NotificationPreferenceValue, context: NotificationPreferenceContext) => void;
  dismissNotice: () => void;
}

const NotificationDemoContext = createContext<NotificationDemoContextValue | null>(null);

/** In-memory state survives admin navigation and is discarded when the admin layout unmounts. */
export function NotificationDemoProvider({ children }: { children: ReactNode }) {
  const { workspaceId } = useStarter();
  const [workspaces, setWorkspaces] = useState(initialNotificationData);
  const currentWorkspace = useRef(workspaceId);
  const mounted = useRef(true);
  useLayoutEffect(() => { currentWorkspace.current = workspaceId; }, [workspaceId]);
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  function commitOperation(operation: NotificationOperation, revision: number) {
    if (!mounted.current || currentWorkspace.current !== workspaceId || operation.type !== "read") return;
    setWorkspaces(current => {
      const previous = current[workspaceId];
      if (previous.revision !== revision || !notificationOperationAllowed(previous, operation)) return current;
      return { ...current, [workspaceId]: { ...previous, revision: previous.revision + 1, items: previous.items.map(item => operation.ids.includes(item.id) ? { ...item, read: operation.read } : item) } };
    });
  }

  function commitPreferences(value: NotificationPreferenceValue, context: NotificationPreferenceContext) {
    if (!mounted.current || context.signal.aborted || context.contextKey !== workspaceId || currentWorkspace.current !== workspaceId) return;
    setWorkspaces(current => {
      const previous = current[workspaceId];
      if (previous.preferenceRevision !== context.revision) return current;
      return { ...current, [workspaceId]: { ...previous, preferences: value } };
    });
  }

  function dismissNotice() {
    if (!mounted.current || currentWorkspace.current !== workspaceId) return;
    setWorkspaces(current => ({ ...current, [workspaceId]: { ...current[workspaceId], noticeDismissed: true } }));
  }

  return <NotificationDemoContext.Provider value={{ data: workspaces[workspaceId], commitOperation, commitPreferences, dismissNotice }}>{children}</NotificationDemoContext.Provider>;
}

export function useNotificationDemo() {
  const context = useContext(NotificationDemoContext);
  if (!context) throw new Error("Notification views need NotificationDemoProvider.");
  return context;
}
