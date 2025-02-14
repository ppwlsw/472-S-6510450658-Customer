
import { useEffect, useState } from "react";

export default function QueueStatus({ queueId }: { queueId: string }) {
  const [status, setStatus] = useState<{ position: number } | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost/api/subscribe?queue_id=${queueId}`);
    eventSource.onmessage = (event) => {
        console.log("I Sus")
      const data = JSON.parse(event.data);
      console.log(data)
      if (data.event === "next" || data.event === "cancel") {
        fetch(`http://localhost/api/queues/${queueId}/status`)
          .then((res) => res.json())
          .then((statusData) => {
            setStatus(statusData);
          });
      }
    };

    eventSource.onerror = () => {
      console.error("EventSource failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queueId]);

  return (
    <div>
      <h2>Queue Status</h2>
      {status ? <p>Position: {status.position}</p> : <p>Loading queue status...</p>}
    </div>
  );
}