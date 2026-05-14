function cloneHastNode(node) {
  if (Array.isArray(node)) return node.map(cloneHastNode);
  if (node && typeof node === "object") {
    const cloned = {};
    for (const key of Object.keys(node)) {
      cloned[key] = cloneHastNode(node[key]);
    }
    return cloned;
  }
  return node;
}

export function rehypeRecipeInstructions() {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type !== "element" || node.tagName !== "ul") continue;

      const hasNestedUl = node.children.some(
        (child) =>
          child.type === "element" &&
          child.tagName === "li" &&
          child.children.some(
            (grandchild) => grandchild.type === "element" && grandchild.tagName === "ul",
          ),
      );

      if (hasNestedUl) {
        node.properties = node.properties || [];
        node.properties["class"] = [node.properties["class"], "recipe-instructions grouped"].filter(Boolean).join(" ").trim();

        for (const li of node.children) {
          if (li.type !== "element" || li.tagName !== "li") continue;

          const nestedUl = li.children.find(
            (c) => c.type === "element" && c.tagName === "ul",
          );
          if (!nestedUl) continue;

          const textChildren = li.children.filter(
            (c) => c.type === "text" && c.value.trim().length > 0,
          );

          if (textChildren.length > 0) {
            const textValue = textChildren.map((t) => t.value).join("").trim();

            const pNode = {
              type: "element",
              tagName: "p",
              properties: {},
              children: [{ type: "text", value: textValue + "\n" }],
              data: {},
            };

            li.children = [pNode, nestedUl];
          }
        }
      } else {
        node.properties = node.properties || [];
        node.properties["class"] = [node.properties["class"], "recipe-instructions"].filter(Boolean).join(" ").trim();
      }
    }
  };
}
