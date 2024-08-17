export const SplitCalls = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/ruby_hackathon_data.json`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch the JSON data');
    }
    const data = await res.json();

    return data.map((call, index) => ({
        id: call._id,
        index: index + 1,
        content: call._source,
    }));
};