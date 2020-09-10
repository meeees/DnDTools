import React from 'react';
import PropTypes from 'prop-types';

function NotImplementedComponent(props) {
  return <div>{props.name} is not implemented yet :(</div>;
}

NotImplementedComponent.propTypes = {
  name: PropTypes.string
};

export default NotImplementedComponent;