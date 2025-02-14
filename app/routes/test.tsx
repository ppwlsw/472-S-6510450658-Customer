import { useEffect, useState } from "react";
import QueueStatus from "./QueueStatus";

export default function test(){
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch("http://localhost/api/queues/1/status")
            .then((res) => res.json())
            .then((data) => setStatus(data))
            .catch((error) => console.error("Error fetching status:", error));
    }, []);
    return  (<div>
        <QueueStatus queueId="1"></QueueStatus>
        <p>I SUS</p>
        <p>Queue Status: {status ? JSON.stringify(status) : "Loading..."}</p>
    </div>);
}