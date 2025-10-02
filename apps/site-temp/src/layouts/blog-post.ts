class BlogPostStore {
  listen() {
    const headings = Array.from(
      document
        .querySelector("[data-id='article']")
        ?.querySelectorAll("h2, h3, h4, h5, h6") || [],
    ) as HTMLHeadingElement[];

    const asideList = Array.from(
      document
        .querySelector("[data-id='aside-list']")
        ?.querySelectorAll("li") || [],
    ) as HTMLLIElement[];

    const headingMapAside = new WeakMap<HTMLHeadingElement, HTMLLIElement>();
    headings.forEach(heading => {
      headingMapAside.set(
        heading as HTMLHeadingElement,
        asideList.find(
          aside => aside.dataset.id === heading.id,
        ) as HTMLLIElement,
      );
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const rect = entry.target.getBoundingClientRect();
        // 视口中或者视口上方
        if (entry.isIntersecting || rect.top < 0) {
          headingMapAside
            .get(entry.target as HTMLHeadingElement)
            ?.classList.add("active");
        }
        // 视口下方
        else {
          headingMapAside
            .get(entry.target as HTMLHeadingElement)
            ?.classList.remove("active");
        }
      });
    });

    if (headings) {
      headings.forEach(heading => observer.observe(heading));
    }
  }
}

export const blogPostStore = new BlogPostStore();
blogPostStore.listen();
