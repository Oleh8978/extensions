import React from 'react';
import _ from 'lodash';

import {
  Subtitle,
  Caption,
  View,
  Row,
  Icon,
  TouchableOpacity,
  Divider,
  Button,
} from '@shoutem/ui';

import { formatDate } from '../shared/Calendar';
import EventImage from './EventImage';
import { BaseEventItem } from './BaseEventItem';

/**
 * Component used to render single list event item
 */
export default class ListEventView extends BaseEventItem {

  render() {
    const { event, style, onPress } = this.props;
    
    return (
      <TouchableOpacity
        disabled={!_.isFunction(onPress)}
        onPress={this.onPress}
        key={event.id}
        style={style}
      >
        <Row>
          <EventImage
            styleName="small rounded-corners"
            event={event}
          />
          <View styleName="vertical stretch space-between md-gutter-horizontal">
            <Subtitle>{event.name}</Subtitle>
            <Caption>{formatDate(event.startTime)}</Caption>
          </View>
          <Button
            styleName="tight clear"
            onPress={this.action}
          >
            <Icon name="add-event" />
          </Button>
        </Row>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }
}
