export const handleScrollTo = (ref) => {
  if (ref.current) {
    const element = ref.current.getBoundingClientRect();
    const offset = 80;

    window.scrollTo({
      top: element.top + window.scrollY - offset,
      behavior: "smooth",
    });
  }
};
