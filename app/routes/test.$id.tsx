import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
    const id = params.id
    console.log(id)
    const data = {
        message: "Hello from the server!",
        id: id
    };
    return json(data);
}



export default function Test() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            <div>{data.message}</div>
            <div>{data.id}</div>
        </div>
    );
}
