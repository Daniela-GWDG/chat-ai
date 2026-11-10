export default function MetaBox({ meta }) {
    // Function to truncate the model name
    const truncateModel = (text, length) => {
        if (!text) return "";
        return text.length > length ? text.slice(0, length) + "..." : text;
    };
    let parts = [];
    if (meta?.model) {
        // Truncate very long model names — adjust as needed
        parts.push(truncateModel(meta.model, 30));
    }
    if (meta?.usage) {
        const promptTokens = meta.usage?.prompt_tokens ?? "N/A";
        const completionTokens = meta.usage?.completion_tokens ?? "N/A";
        parts.push(`${promptTokens} + ${completionTokens} tokens`);
    }
    // Combine with non-breaking spaces around dot
    const displayText = parts.join(" \u00A0•\u00A0 ");

    return (
        <div className="
            items-center justify-end min-w-0 flex-shrink w-auto
            max-w-[200px] sm:max-w-[400px] md:max-w-[800px]">
            <p
                className="
 text-xs text-base-content/70 text-right
                    truncate
                "
            >
                {displayText}
            </p>
        </div>
    );
}