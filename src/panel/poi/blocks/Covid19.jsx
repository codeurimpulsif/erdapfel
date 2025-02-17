/* globals _ */
import React, { Fragment } from 'react';
import { useConfig } from 'src/hooks';
import TimeTable from './TimeTable';
import OsmSchedule from 'src/adapters/osm_schedule';
import Telemetry from 'src/libs/telemetry';
import { Button } from '@qwant/qwant-ponents';

const getContent = ({ status, opening_hours, note, contribute_url }) => {
  const additionalInfo = note && (
    <div className="covid19-note">
      {/* @TODO: replace by SVG icon */}
      <i className="icon-icon_info" />
      <p>{note}</p>
    </div>
  );

  const source = contribute_url && (
    <div className="covid19-source">
      Source&nbsp;:&nbsp;
      <a
        rel="noopener noreferrer"
        href="https://caresteouvert.fr"
        onClick={() => {
          Telemetry.add(Telemetry.COVID_CARESTEOUVERT_LINK);
        }}
      >
        caresteouvert.fr
      </a>
      <div className="u-center">
        <Button
          className="covid19-contributeLink"
          rel="noopener noreferrer"
          href={contribute_url}
          onClick={() => {
            Telemetry.add(Telemetry.COVID_CARESTEOUVERT_CONTRIBUTE);
          }}
        >
          {_('Report a change', 'covid19')}
        </Button>
      </div>
    </div>
  );

  let content;
  let schedule;
  switch (status) {
    case 'open':
    case 'open_as_usual':
      schedule = opening_hours && new OsmSchedule(opening_hours);
      content = (
        <Fragment>
          {schedule && (
            <div className="covid19-timeTableContainer">
              {/* @TODO: replace by SVG icon */}
              <i className="icon-icon_clock" />
              <TimeTable schedule={schedule} />
            </div>
          )}
          {!schedule && (
            <div className="covid19-changeWarning">
              {_('Opening hours subject to change', 'covid19')}
            </div>
          )}
          {additionalInfo}
          {source}
        </Fragment>
      );
      break;
    case 'maybe_open':
      content = (
        <Fragment>
          {additionalInfo}
          {source}
        </Fragment>
      );
      break;
    case 'closed':
    default:
      content = source;
  }

  return content;
};

/* eslint-disable */
const LocalizedWarning = ({ countryCode }) => {
  const { frInformationUrl } = useConfig('covid19');

  return (
    <div>
      <p>{_('Please comply with government travel restrictions.', 'covid19')}</p>
      {countryCode === 'FR' && (
        <p>
          {_('More information at', 'covid19')}{' '}
          <a rel="noopener noreferrer" href={frInformationUrl}>
            gouvernement.fr/info-coronavirus
          </a>
        </p>
      )}
    </div>
  );
};

const LegalWarning = ({ countryCode }) => (
  <div className="covid19-legalWarning">
    {/* @TODO: replace by SVG icon */}
    <i className="icon-alert-triangle" />
    <LocalizedWarning countryCode={countryCode} />
  </div>
);

const Status = ({ status }) => {
  const statusMessages = {
    open: _('Open during the sanitary crisis', 'covid19'),
    open_as_usual: _('Open during the sanitary crisis', 'covid19'),
    maybe_open: _('Potentially open during the sanitary crisis', 'covid19'),
    closed: _('Closed during the sanitary crisis', 'covid19'),
    unknown: _('No information on opening during the sanitary crisis', 'covid19'),
  };

  return (
    <h4 className="poi_panel__sub_block__title">
      <span className="covid19-tag">Covid-19</span>
      <span>{statusMessages[status] || statusMessages['unknown']}</span>
    </h4>
  );
};

const Covid19 = ({ block, countryCode }) => {
  return (
    <div className="covid19">
      <Status status={block.status} />
      {getContent(block)}
      <LegalWarning countryCode={countryCode} />
    </div>
  );
};
/* eslint-enable */

export default Covid19;
