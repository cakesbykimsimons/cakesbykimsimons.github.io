function replaceFractions(node) {
  if (node.type === "text") {
    node.value = node.value.replace(/(\d+)\/(\d+)/g, "$1\u2044$2");
  } else if (node.children) {
    for (const child of node.children) replaceFractions(child);
  }
}

function findRecipeUl(node) {
  if (node.type === "element" && node.tagName === "ul") return node;
  if (node.type === "mdxJsxFlowElement") {
    for (const child of node.children || []) {
      const found = findRecipeUl(child);
      if (found) return found;
    }
  }
  return null;
}

export function rehypeRecipeInstructions() {
  return (tree, options) => {
    const isRecipe = options?.file?.path?.includes("/recipes/");
    if (isRecipe) replaceFractions(tree);

    let target = null;
    for (const node of tree.children) {
      target = findRecipeUl(node);
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
        "recipe-instructions grouped",
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
        "recipe-instructions",
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
  };
}
