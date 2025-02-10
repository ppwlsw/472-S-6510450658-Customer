import { useFetcher, useLoaderData } from "@remix-run/react";

export async function loader() {
    return {
        message: "EIEI",
        status: 200
    };
}


export default function Login() {
    const {message, status} = useLoaderData<typeof loader>();
    const fetcher = useFetcher();
    return (
        <div className="flex flex-col h-svh justify-center items-center gap-8">
            <fetcher.Form method="GET" action="/auth/google/login">
                <button className="border-2 border-red-500" type="submit">Login Fetcher</button>
            </fetcher.Form>
        </div>

    );
}