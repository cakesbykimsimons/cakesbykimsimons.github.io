function replaceFractions(node) {
  if (node.type === "text") {
    node.value = node.value.replace(/(\d+)\/(\d+)/g, "$1\u2044$2");
  } else if (node.children) {
    for (const child of node.children) replaceFractions(child);
  }
}

function findFirstUl(node) {
  if (node.type === "element" && node.tagName === "ul") return node;
  if (node.type === "mdxJsxFlowElement") {
    for (const child of node.children || []) {
      const found = findFirstUl(child);
      if (found) return found;
    }
  }
  return null;
}

export function rehypeGuideInstructions() {
  return (tree, file) => {
    const filePath = file?.history?.[0] || file?.path || "";
    const isGuide =
      String(filePath).includes("/recipes/") ||
      String(filePath).includes("/how-tos/");
    if (!isGuide) {
      return;
    }
    replaceFractions(tree);

    let target = null;
    for (const node of tree.children) {
      target = findFirstUl(node);
      if (target) break;
    }
    if (!target) return;

    const hasNestedUl = target.children.some(
      (child) =>
        child.type === "element" &&
        child.tagName === "li" &&
        child.children.some(
          (grandchild) =>
            grandchild.type === "element" && grandchild.tagName === "ul",
        ),
    );

    if (hasNestedUl) {
      target.properties = target.properties || [];
      target.properties["class"] = [
        target.properties["class"],
        "guide-instructions grouped",
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      for (const li of target.children) {
        if (li.type !== "element" || li.tagName !== "li") continue;

        const nestedUl = li.children.find(
          (c) => c.type === "element" && c.tagName === "ul",
        );
        if (!nestedUl) continue;

        const textChildren = li.children.filter(
          (c) => c.type === "text" && c.value.trim().length > 0,
        );

        if (textChildren.length > 0) {
          const textValue = textChildren
            .map((t) => t.value)
            .join("")
            .trim();

          const pNode = {
            type: "element",
            tagName: "p",
            properties: {},
            children: [{ type: "text", value: textValue + "\n" }],
            data: {},
          };

          const otherChildren = li.children.filter(
            (c) =>
              !(c.type === "text" && c.value.trim() === "") &&
              c !== nestedUl &&
              !textChildren.includes(c),
          );

          li.children = [pNode, ...otherChildren, nestedUl];
        }
      }
    } else {
      target.properties = target.properties || [];
      target.properties["class"] = [
        target.properties["class"],
        "guide-instructions",
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
  };
}
