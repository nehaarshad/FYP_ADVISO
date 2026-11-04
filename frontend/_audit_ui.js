const fs = require("fs");
const path = require("path");
function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name.startsWith("_")) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (e.name.endsWith(".tsx")) a.push(p);
  }
  return a;
}
let n = 0;
for (const f of walk(__dirname)) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/\b(cn|clsx|classNames)\(/.test(line) || /const \w*[Cc]lass/.test(line)) {
      if (n < 40) console.log(path.relative(__dirname, f) + ":" + (i + 1));
      n++;
    }
  });
}
console.log("total", n);
