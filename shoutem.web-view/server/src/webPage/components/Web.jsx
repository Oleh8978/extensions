import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getShortcut } from 'environment';
import { data } from 'context';
import _ from 'lodash';
import normalizeUrl from 'normalize-url';
import { updateShortcut } from './../reducer';
import WebUrlInput from './WebUrlInput';
import WebEdit from './WebEdit';

const ACTIVE_SCREEN_INPUT = 0;
const ACTIVE_SCREEN_EDIT = 1;

export class Web extends Component {
  constructor(props) {
    super(props);
    this.getActiveScreen = this.getActiveScreen.bind(this);
    this.getShortcutSettings = this.getShortcutSettings.bind(this);
    this.setShortcutSettings = this.setShortcutSettings.bind(this);
    this.handleUrlInputContinueClick = this.handleUrlInputContinueClick.bind(
      this,
    );
    this.handleUrlRemoveClick = this.handleUrlRemoveClick.bind(this);
    this.handleShowNavigationToolbarChange = this.handleShowNavigationToolbarChange.bind(
      this,
    );
    this.handleGeolocationPermissionChange = this.handleGeolocationPermissionChange.bind(
      this,
    );
  }

  getActiveScreen() {
    if (_.has(this.props, 'shortcut.settings.url')) {
      return ACTIVE_SCREEN_EDIT;
    }
    return ACTIVE_SCREEN_INPUT;
  }

  getShortcutSettings() {
    const { shortcut } = this.props;
    if (shortcut && shortcut.settings) {
      return shortcut.settings;
    }
    return {
      url: '',
      showNavigationToolbar: false,
      requireGeolocationPermission: false,
    };
  }

  setShortcutSettings(settings) {
    const { shortcut, updateShortcut } = this.props;
    const { id } = shortcut;

    const currentSettings = this.getShortcutSettings();

    const mergedSettings = { ...currentSettings, ...settings };

    const updatedShortcut = {
      id,
      attributes: {
        settings: mergedSettings,
      },
    };

    updateShortcut(updatedShortcut);
  }

  handleUrlInputContinueClick(url) {
    const normalizedUrl = normalizeUrl(url, { stripWWW: false });
    this.setShortcutSettings({ url: normalizedUrl });
  }

  handleUrlRemoveClick() {
    this.setShortcutSettings({ url: null });
  }

  handleShowNavigationToolbarChange(checked) {
    this.setShortcutSettings({ showNavigationToolbar: checked });
  }

  handleGeolocationPermissionChange(checked) {
    this.setShortcutSettings({ requireGeolocationPermission: checked });
  }

  render() {
    const activeScreen = this.getActiveScreen();
    const {
      url,
      showNavigationToolbar,
      requireGeolocationPermission,
    } = this.getShortcutSettings();

    const { hasWebsiteSettings } = data.params;

    return (
      <div>
        {activeScreen === ACTIVE_SCREEN_INPUT && (
          <WebUrlInput onContinueClick={this.handleUrlInputContinueClick} />
        )}
        {activeScreen === ACTIVE_SCREEN_EDIT && (
          <WebEdit
            hasWebsiteSettings={hasWebsiteSettings}
            url={url}
            showNavigationToolbar={showNavigationToolbar}
            requireGeolocationPermission={requireGeolocationPermission}
            onRemoveClick={this.handleUrlRemoveClick}
            onShowNavigationToolbarChange={
              this.handleShowNavigationToolbarChange
            }
            onRequireGeolocationPermissionChange={
              this.handleGeolocationPermissionChange
            }
          />
        )}
      </div>
    );
  }
}

Web.propTypes = {
  shortcut: PropTypes.object,
  updateShortcut: PropTypes.func,
};

function mapStateToProps() {
  return {
    shortcut: getShortcut(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateShortcut: shortcut => dispatch(updateShortcut(shortcut)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Web);
