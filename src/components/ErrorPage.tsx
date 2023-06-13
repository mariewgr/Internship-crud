import { Button } from "@material-ui/core";
import error from "./../assets/error.jpeg";

export type ErrorPageProps = { onRetry: () => Promise<unknown> };

export default function ErrorPage(p: ErrorPageProps) {
  return (
    <p>
      <h1>Error Page</h1>
      <img src={error}></img>
      <Button onClick={p.onRetry}> Retry </Button>
    </p>
  );
}
