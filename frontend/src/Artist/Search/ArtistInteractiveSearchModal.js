import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'Components/Modal/Modal';
import { sizes } from 'Helpers/Props';
import ArtistInteractiveSearchModalContent from './ArtistInteractiveSearchModalContent';

function ArtistInteractiveSearchModal(props) {
  const {
    isOpen,
    artistId,
    onModalClose
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      size={sizes.EXTRA_LARGE}
      closeOnBackgroundClick={false}
      onModalClose={onModalClose}
    >
      <ArtistInteractiveSearchModalContent
        artistId={artistId}
        onModalClose={onModalClose}
      />
    </Modal>
  );
}

ArtistInteractiveSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  artistId: PropTypes.number.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default ArtistInteractiveSearchModal;
