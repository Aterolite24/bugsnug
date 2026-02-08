import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';
import { subDays, format } from 'date-fns';

const Heatmap = ({ submissions }) => {
    // Process submissions into daily counts
    const getSubmissionCounts = () => {
        const counts = {};
        submissions.forEach(sub => {
            const date = format(new Date(sub.creationTimeSeconds * 1000), 'yyyy-MM-dd');
            counts[date] = (counts[date] || 0) + 1;
        });

        return Object.entries(counts).map(([date, count]) => ({ date, count }));
    };

    const values = getSubmissionCounts();
    const endDate = new Date();
    const startDate = subDays(endDate, 365);

    return (
        <div className="bg-white p-6 rounded-[10px] border border-cultured shadow-card">
            <h3 className="section-heading text-sm mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ocean-green rounded-full"></span>
                Consistency Heatmap
            </h3>

            <div className="overflow-x-auto pb-2">
                <div className="min-w-[800px]">
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={endDate}
                        values={values}
                        classForValue={(value) => {
                            if (!value) {
                                return 'color-empty';
                            }
                            return `color-scale-${Math.min(value.count, 4)}`;
                        }}
                        tooltipDataAttrs={(value) => {
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': value.date ? `${value.date}: ${value.count} submissions` : 'No submissions',
                            };
                        }}
                        showWeekdayLabels={true}
                    />
                    <Tooltip id="heatmap-tooltip" border="1px solid #e2e8f0" style={{ backgroundColor: "#ffffff", color: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                </div>
            </div>

            <style>{`
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: #64748b;
        }
        .react-calendar-heatmap .color-empty { fill: #f1f5f9; rx: 4px; } /* Slate-100 */
        .react-calendar-heatmap .color-scale-1 { fill: #bbf7d0; rx: 4px; } /* Green-200 */
        .react-calendar-heatmap .color-scale-2 { fill: #86efac; rx: 4px; } /* Green-300 */
        .react-calendar-heatmap .color-scale-3 { fill: #4ade80; rx: 4px; } /* Green-400 */
        .react-calendar-heatmap .color-scale-4 { fill: #22c55e; rx: 4px; } /* Green-500 */
      `}</style>
        </div>
    );
};

export default Heatmap;
