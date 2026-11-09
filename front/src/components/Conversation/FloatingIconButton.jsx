/** Round icon button floating over the conversation (scroll, undo, close chat). */
export default function FloatingIconButton({ danger = false, children, ...props }) {
  return (
    <button
      type="button"
      className={`h-10 w-10 flex items-center justify-center rounded-full bg-base-100 text-accent shadow-lg cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "hover:bg-error hover:text-error-soft"
          : "hover:bg-accent hover:text-accent-content"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
