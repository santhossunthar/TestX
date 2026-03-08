(() => {
  if ((window as { __inspectorPlusHooked?: boolean }).__inspectorPlusHooked) return;
  (window as { __inspectorPlusHooked?: boolean }).__inspectorPlusHooked = true;

  const wrap = (level: "log" | "info" | "warn" | "error") => {
    const original = console[level];
    console[level] = (...args: unknown[]) => {
      window.postMessage(
        {
          source: "inspector-plus",
          kind: "console",
          level,
          args,
          ts: Date.now()
        },
        "*"
      );
      original.apply(console, args);
    };
  };

  wrap("log");
  wrap("info");
  wrap("warn");
  wrap("error");
})();
