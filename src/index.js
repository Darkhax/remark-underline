export default function attacher(options) {

    options = options ?? {}; // Prevents options from being null
    const Parser = this.Parser.prototype;

    const nodeType = options.nodeType ?? 'underline';
    const marker = options.marker ?? '__';
    const classNames = options.classNames ?? ["underline"];
    const tagType = options.tagType ?? 'ins';

    Parser.inlineTokenizers.underline = function underlineTokenizer(eat, value, silent) {

        if (value.startsWith(marker)) {

            const end = value.indexOf(marker, marker.length);

            if (end > -1) {

                if (silent) {

                    return true;
                }

                const text = value.substring(marker.length, end);

                const now = eat.now();
                now.column += marker.length;
                now.offset += marker.length;

                return eat(marker + text + marker)({
                    type: nodeType,
                    children: this.tokenizeInline(text, now),
                    data: {
                        hName: tagType,
                        hProperties: classNames.length ? { className: classNames } : {}
                    }
                });
            }
        }

        return false;
    };
    Parser.inlineTokenizers.underline.locator = (value, fromIndex) => value.indexOf(marker, fromIndex);
    Parser.inlineMethods.splice(Parser.inlineMethods.indexOf('strong'), 0, 'underline');
};
