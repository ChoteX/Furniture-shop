import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="container section-spacing">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back home</Link>
    </section>
  );
}
