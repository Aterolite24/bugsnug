const resources = [
    {
        title: 'Dynamic Programming',
        desc: 'Master DP with these classic problems and tutorials.',
        link: 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html',
        color: 'primary'
    },
    {
        title: 'Graph Theory',
        desc: 'DFS, BFS, Dijkstra, and everything in between.',
        link: 'https://cp-algorithms.com/graph/breadth-first-search.html',
        color: 'secondary'
    },
    {
        title: 'Data Structures',
        desc: 'Segment Trees, BIT, and more advanced structures.',
        link: 'https://cp-algorithms.com/data_structures/segment_tree.html',
        color: 'accent-cyan'
    },
    {
        title: 'Number Theory',
        desc: 'Primes, GCD, Modular Arithmetic for CP.',
        link: 'https://cp-algorithms.com/algebra/prime-sieve-linear.html',
        color: 'accent-amber'
    },
];

const StudyMaterial = () => {
    return (
        <div className="space-y-6 animate-float">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-8 bg-accent-cyan rounded-full"></span>
                Study Zone
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res, index) => (
                    <a
                        key={index}
                        href={res.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card p-6 group hover:border-primary/50 transition-all block hover:-translate-y-1"
                    >
                        <h3 className={`text-xl font-bold mb-2 group-hover:text-primary transition-colors text-white`}>
                            {res.title}
                        </h3>
                        <p className="text-dark-muted text-sm mb-4">
                            {res.desc}
                        </p>
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                            Read Article <ArrowIcon className="w-4 h-4" />
                        </span>
                    </a>
                ))}
            </div>

            <div className="glass-card p-8 mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Tip of the Day</h3>
                <div className="bg-dark-bg/50 p-6 rounded-xl border border-dark-border">
                    <p className="text-dark-text italic">
                        "Always check constraints! If N ≤ 20, think about O(2^N) or O(N * 2^N). If N ≤ 1000, O(N^2) is fine. If N ≤ 10^5, aim for O(N log N) or O(N)."
                    </p>
                </div>
            </div>
        </div>
    );
};

const ArrowIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

export default StudyMaterial;
