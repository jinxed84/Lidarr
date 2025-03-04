import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ArtistPoster from 'Artist/ArtistPoster';
import DeleteArtistModal from 'Artist/Delete/DeleteArtistModal';
import EditArtistModalConnector from 'Artist/Edit/EditArtistModalConnector';
import ArtistIndexProgressBar from 'Artist/Index/ProgressBar/ArtistIndexProgressBar';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import { icons } from 'Helpers/Props';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import translate from 'Utilities/String/translate';
import ArtistIndexPosterInfo from './ArtistIndexPosterInfo';
import styles from './ArtistIndexPoster.css';

class ArtistIndexPoster extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasPosterError: false,
      isEditArtistModalOpen: false,
      isDeleteArtistModalOpen: false
    };
  }

  //
  // Listeners

  onEditArtistPress = () => {
    this.setState({ isEditArtistModalOpen: true });
  };

  onEditArtistModalClose = () => {
    this.setState({ isEditArtistModalOpen: false });
  };

  onDeleteArtistPress = () => {
    this.setState({
      isEditArtistModalOpen: false,
      isDeleteArtistModalOpen: true
    });
  };

  onDeleteArtistModalClose = () => {
    this.setState({ isDeleteArtistModalOpen: false });
  };

  onPosterLoad = () => {
    if (this.state.hasPosterError) {
      this.setState({ hasPosterError: false });
    }
  };

  onPosterLoadError = () => {
    if (!this.state.hasPosterError) {
      this.setState({ hasPosterError: true });
    }
  };

  //
  // Render

  render() {
    const {
      id,
      artistName,
      monitored,
      foreignArtistId,
      status,
      nextAlbum,
      lastAlbum,
      statistics,
      images,
      posterWidth,
      posterHeight,
      detailedProgressBar,
      showTitle,
      showMonitored,
      showQualityProfile,
      qualityProfile,
      showNextAlbum,
      showSearchAction,
      showRelativeDates,
      shortDateFormat,
      longDateFormat,
      timeFormat,
      isRefreshingArtist,
      isSearchingArtist,
      onRefreshArtistPress,
      onSearchPress,
      ...otherProps
    } = this.props;

    const {
      albumCount,
      sizeOnDisk,
      trackCount,
      trackFileCount,
      totalTrackCount
    } = statistics;

    const {
      hasPosterError,
      isEditArtistModalOpen,
      isDeleteArtistModalOpen
    } = this.state;

    const link = `/artist/${foreignArtistId}`;

    const elementStyle = {
      width: `${posterWidth}px`,
      height: `${posterHeight}px`
    };

    return (
      <div>
        <div className={styles.content}>
          <div className={styles.posterContainer} title={artistName}>
            <Label className={styles.controls}>
              <SpinnerIconButton
                className={styles.action}
                name={icons.REFRESH}
                title={translate('RefreshArtist')}
                isSpinning={isRefreshingArtist}
                onPress={onRefreshArtistPress}
              />

              {
                showSearchAction &&
                  <SpinnerIconButton
                    className={styles.action}
                    name={icons.SEARCH}
                    title={translate('SearchForMonitoredAlbums')}
                    isSpinning={isSearchingArtist}
                    onPress={onSearchPress}
                  />
              }

              <IconButton
                className={styles.action}
                name={icons.EDIT}
                title={translate('EditArtist')}
                onPress={this.onEditArtistPress}
              />
            </Label>

            {
              status === 'ended' &&
                <div
                  className={styles.ended}
                  title={translate('Inactive')}
                />
            }

            <Link
              className={styles.link}
              style={elementStyle}
              to={link}
            >
              <ArtistPoster
                className={styles.poster}
                style={elementStyle}
                images={images}
                size={250}
                lazy={false}
                overflow={true}
                onError={this.onPosterLoadError}
                onLoad={this.onPosterLoad}
              />

              {
                hasPosterError &&
                  <div className={styles.overlayTitle}>
                    {artistName}
                  </div>
              }

            </Link>
          </div>

          <ArtistIndexProgressBar
            monitored={monitored}
            status={status}
            trackCount={trackCount}
            trackFileCount={trackFileCount}
            totalTrackCount={totalTrackCount}
            posterWidth={posterWidth}
            detailedProgressBar={detailedProgressBar}
          />

          {
            showTitle &&
              <div className={styles.title} title={artistName}>
                {artistName}
              </div>
          }

          {
            showMonitored &&
              <div className={styles.title}>
                {monitored ? 'Monitored' : 'Unmonitored'}
              </div>
          }

          {
            showQualityProfile &&
              <div className={styles.title} title={translate('QualityProfile')}>
                {qualityProfile.name}
              </div>
          }

          {
            showNextAlbum && !!nextAlbum?.releaseDate &&
              <div className={styles.nextAlbum} title={translate('NextAlbum')}>
                {
                  getRelativeDate(
                    nextAlbum.releaseDate,
                    shortDateFormat,
                    showRelativeDates,
                    {
                      timeFormat,
                      timeForToday: true
                    }
                  )
                }
              </div>
          }
          <ArtistIndexPosterInfo
            nextAlbum={nextAlbum}
            lastAlbum={lastAlbum}
            albumCount={albumCount}
            sizeOnDisk={sizeOnDisk}
            qualityProfile={qualityProfile}
            showQualityProfile={showQualityProfile}
            showNextAlbum={showNextAlbum}
            showRelativeDates={showRelativeDates}
            shortDateFormat={shortDateFormat}
            longDateFormat={longDateFormat}
            timeFormat={timeFormat}
            {...otherProps}
          />

          <EditArtistModalConnector
            isOpen={isEditArtistModalOpen}
            artistId={id}
            onModalClose={this.onEditArtistModalClose}
            onDeleteArtistPress={this.onDeleteArtistPress}
          />

          <DeleteArtistModal
            isOpen={isDeleteArtistModalOpen}
            artistId={id}
            onModalClose={this.onDeleteArtistModalClose}
          />
        </div>
      </div>
    );
  }
}

ArtistIndexPoster.propTypes = {
  id: PropTypes.number.isRequired,
  artistName: PropTypes.string.isRequired,
  monitored: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  foreignArtistId: PropTypes.string.isRequired,
  nextAlbum: PropTypes.object,
  lastAlbum: PropTypes.object,
  statistics: PropTypes.object.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  posterWidth: PropTypes.number.isRequired,
  posterHeight: PropTypes.number.isRequired,
  detailedProgressBar: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool.isRequired,
  showMonitored: PropTypes.bool.isRequired,
  showQualityProfile: PropTypes.bool.isRequired,
  qualityProfile: PropTypes.object.isRequired,
  showNextAlbum: PropTypes.bool.isRequired,
  showSearchAction: PropTypes.bool.isRequired,
  showRelativeDates: PropTypes.bool.isRequired,
  shortDateFormat: PropTypes.string.isRequired,
  longDateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  isRefreshingArtist: PropTypes.bool.isRequired,
  isSearchingArtist: PropTypes.bool.isRequired,
  onRefreshArtistPress: PropTypes.func.isRequired,
  onSearchPress: PropTypes.func.isRequired
};

ArtistIndexPoster.defaultProps = {
  statistics: {
    albumCount: 0,
    trackCount: 0,
    trackFileCount: 0,
    totalTrackCount: 0
  }
};

export default ArtistIndexPoster;
