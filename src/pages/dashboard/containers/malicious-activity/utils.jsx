import React from 'react';

import { pipelineToName } from 'lib/decorators';

export const filterByMultipleTags = (data, tags) => {
  if (!tags.length) {
    return data;
  }

  return data.filter((item) => {
    let match = 0;
    tags.forEach((tag) => {
      if (item.entity_name.toLowerCase().includes(tag.toLowerCase())
        || item.threat.toLowerCase().includes(tag.toLowerCase())) {
        match += 1;
      }
    });

    return match === tags.length;
  });
};

export const renderDropdownLabel = (key, pipeline, value) => (
  <span className="dhd-dropdown__option" key={key}>
    <span className="dhd-dropdown__option--label">{pipelineToName(pipeline)}</span>
    <span className="dhd-dropdown__option--value">{value}</span>
  </span>
);
