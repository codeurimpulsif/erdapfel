import React, { useState } from 'react';
import RoadMapItem from './RoadMapItem';
import RoadMapIcon from './RoadMapIcon';
import PublicTransportLine from './PublicTransportLine';
import LegLine from './LegLine';
import { getTransportTypeIcon, formatDuration } from 'src/libs/route_utils';
import { Chevron } from 'src/components/ui';

const TransportLineLeg = ({ leg }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { mode, info = {}, stops = [], from, to, duration } = leg;

  return (
    <RoadMapItem
      icon={<RoadMapIcon iconClass={getTransportTypeIcon(leg)} />}
      className="itinerary_roadmap_item--transportLine"
      line={<LegLine info={info} mode={mode} />}
      distance={formatDuration(duration)}
    >
      <div
        className="itinerary_roadmap_item_summary itinerary_roadmap_item_summary--openable"
        onClick={() => setDetailsOpen(!detailsOpen)}
      >
        <div>
          <PublicTransportLine mode={mode} info={info} showDirection />
          {!detailsOpen && from.name && to.name && (
            <div>
              {/* TODO: replace by SVG icon */}
              {from.name} <i className="icon-chevrons-right" /> {to.name}
            </div>
          )}
        </div>
        <Chevron up={detailsOpen} />
      </div>
      {detailsOpen && (
        <div className="itinerary_roadmap_substeps">
          {[from, ...stops, to].map((stop, index) => (
            <div className="itinerary_roadmap_substep" key={index}>
              <div
                className="itinerary_roadmap_substep_bullet"
                style={{ borderColor: info.lineColor ? `#${info.lineColor}` : 'black' }}
              />
              {stop.name}
            </div>
          ))}
        </div>
      )}
    </RoadMapItem>
  );
};

export default TransportLineLeg;
