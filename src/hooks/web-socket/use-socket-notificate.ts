"use client";

import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

export function useStompNotification(
  userId: string,
  onMessage: (message: IMessage) => void
) {
  const stompClientRef = useRef<Client | null>(null);
  useEffect(() => {
    if (!userId) return;
    console.warn("🛑 userId is undefined, STOMP will not subscribe.");
    const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_URL_SOCKET}/ws`);
    console.log("user-id", userId);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      onConnect: () => {
        stompClient.subscribe(`/topic/notifications/${userId}`, onMessage);
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [userId, onMessage]);
}
