# Live Class Video Chat & WebSockets Documentation

This document explicitly breaks down how the right-side chat panel in `VideoChat.jsx` works, covering how it syncs over WebSockets asynchronously, implements pagination to fetch older messages seamlessly, and controls the chat-box UI.

## 1. WebSockets: Real-Time Communication

Unlike standard API calls which are one-way (Client -> Server -> Client), **WebSockets** maintain a continuous, open connection. This allows Django to instantly push new messages to **all** connected students simultaneously without any of them needing to refresh the page.

### establishing the connection
In `VideoChat.jsx`, when the component first mounts, it opens a WebSocket connection pointed directly at your Django Channels backend server using the `classId`.

```javascript
ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${classId}/`);
```

### receiving messages
Once connected, the `ws.current.onmessage` event listener constantly waits in the background. If another student sends a message, Django pushes it through the WebSocket. React intercepts it immediately, updates the `messages` state to include the new text block, and injects it into the DOM.

## 2. Auto-Scroll Mechanism

Just like WhatsApp, Discord, or the AI Assistant, users shouldn't have to manually stretch their mouse to see new text.

### How it works:
Instead of forcing the entire application page to scroll (which breaks layouts), we attach a `chatContainerRef` onto the specific `<div>` handling the chat messages:

```javascript
<div ref={chatContainerRef} className="flex-1 overflow-y-auto...">
```

Every time a user opens the video class initially, OR a new WebSocket message gets intercepted from a peer, a quick timeout fires:

```javascript
setTimeout(() => {
    if (chatContainerRef.current) {
        // Tells the container to forcibly scroll its inner view down to its own maximum height!
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
}, 100);
```
This guarantees the user is always glued to the bottom where the newest messages reside.

## 3. Pagination & State (Fetching Older Messages)

To prevent your browser from crashing if a live class chat has 10,000+ messages, we don't load them all at once. We grab them in "pages" of 20 at a time.

1. **Initial Load:** Django checks `LiveClassMessage.objects.filter(...)` and slices off just the latest top 20 messages. It returns `{ has_more: true, next_page: 2, messages: [...] }`. React receives this and places the top 20 chats in the UI.
2. **Scrolling Up:** An `onScroll={handleScroll}` event is attached to the chat container. As the user begins scrolling back in time, the browser calculates their scrolling distance via `scrollTop`.
3. **Trigger:** If `scrollTop === 0` (meaning their mouse has hit the absolute ceiling of the window), the frontend automatically changes the state: `setPage(prev => prev + 1)`.
4. **Append Without Jumping:** `useEffect` catches this `page` update and calls Django for the remaining next 20 messages. React pushes them into the array BEFORE the current ones (`[...new_messages, ...old_messages]`). This prevents duplications and allows the user to browse infinitely up into the history without ever losing out on new web-socket messages flying in.
