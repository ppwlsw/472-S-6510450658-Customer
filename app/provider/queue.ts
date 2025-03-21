import type { Queue } from "~/types/queue"

class QueueProvider {
    private queue: Queue

    constructor(queue: Queue) {
        this.queue = queue
    }
}
