// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { bool } from 'prop-types';

export default class Spinner extends Component {

    static propTypes = {
        isSpinning: bool.isRequired
    }

    static defaultProps = {
        isSpinning: false
    }

    render () {
        const { isSpinning } = this.props;

        return (
            isSpinning ? <div className = { Styles.spinner } /> : null
        );
    }

}
