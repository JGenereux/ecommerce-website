import { BlinkBlur } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="loading-container">
      <h3>Loading...</h3>
      <LoadingLogo />
    </div>
  );
}

function LoadingLogo() {
  return <BlinkBlur color="#c9716b" size="medium" text="" textColor="" />;
}
