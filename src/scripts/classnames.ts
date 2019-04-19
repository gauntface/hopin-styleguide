class ClassName {
    validate() {
        for (const s of document.styleSheets) {
            try {
                const cssStylesheet = s as CSSStyleSheet;
                for (const r of cssStylesheet.cssRules) {
                    // ((?:[a-z0-9]|-(?=[a-z0-9]))+) uses look ahead.
                    // Match a-z0-9 OR a - followed by a-z0-9
                    const regex = /^\.(?:__([a-z0-9-]*)__)?([cul])-((?:[a-z0-9]|-(?=[a-z0-9]))+)(?:_{2}|-{2})?((?:[a-z0-9]|-(?=[a-z0-9]))+)(?:-{2})?((?:[a-z0-9]|-(?=[a-z0-9]))+)$/;
                    if (r instanceof CSSStyleRule) {
                        console.log(r.selectorText);
                    }
                    /* const cssStyleRule = r as {
                        styleMap?: StyleMap
                    };
                    if (cssStyleRule['styleMap']) {
                        const map = cssStyleRule['styleMap'];
                        for (const e of map.entries()) {
                            // The format of e is ["<param name>", [["<value>"]]]
                            const name = e[0] as string;
                            if (name.indexOf('--') === 0) {
                                const value = e[1][0][0];
                                group.variables.push({
                                    prettyName: friendlyName(name),
                                    variableName: name,
                                    value,
                                });
                            }
                        }
                    }*/
                }
            } catch (err) {
                // External stylesheets will not be accessible from JavaScript
                // in which case this error will be thrown.
                console.error(`Unable to read styles for ${s.href}`, err);
            }
        }
    }
}

window.addEventListener('load', function() {
    new ClassName().validate();
})