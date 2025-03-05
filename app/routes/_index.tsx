import { redirect } from "react-router";



export async function loader(){
  return redirect("/homepage");
}

export default function Index() {
  return <h1>Index</h1>;
}
