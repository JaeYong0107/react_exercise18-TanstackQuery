import { useIsFetching } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function Header({ children }) {
  const fetching = useIsFetching();
  return (
    <>
      <div id="main-header-loading">
        {fetching > 0 && <progress value={fetching} />}
      </div>
      <header id="main-header">
        <div id="header-title">
          <Link to='/' className="h1">React Events</Link>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
