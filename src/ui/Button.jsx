import { Link } from "react-router-dom";

function Button({ children, disabled, to, type, onClick }) {
  const base =
    "inline-block font-semibold text-sm tracking-wide uppercase transition-colors duration-300 bg-yellow-400 rounded-full disabled:cursor-not-allowed text-stone-800 hover:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 focus:ring-offset-2";

  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " py-2 px-4 md:px-5 md:py-2.5 text-xs",
    round: base + " py-1 px-2.5 md:px-3.5 md:py-2 text-sm",
    secondary:
      "inline-block text-sm px-4 py-2.5 md:px-6 md:py-3.5 font-semibold tracking-wide uppercase transition-colors duration-300 border-2 border-stone-300 rounded-full disabled:cursor-not-allowed text-stone-400 hover:bg-stone-300 focus:outline-none focus:ring hover:text-stone-800 focus:ring-stone-200 focus:bg-stone-800 focus:ring-offset-2",
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
}

export default Button;
