export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
        month: 'short',
        day: '2-digit',

        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    // Format the date according to the options
    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate;
}


