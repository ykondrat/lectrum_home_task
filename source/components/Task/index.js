// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

import { bool, func, string } from 'prop-types';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import cx from 'classnames';

export default class Task extends PureComponent {

    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed: bool.isRequired,
        favorite: bool.isRequired,
        id: string.isRequired,
        message: string.isRequired
    }

    static defaultProps = {
        completed: false,
        favorite: false
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    state = {
        isTaskEditing: false,
        newMessage:    this.props.message
    }

    taskInput = React.createRef();

    _setTaskEditingState = (bool) => {
        if (bool) {
            this._taskInputFocus();
        }
        this.setState({
            isTaskEditing: bool
        })
    }

    _taskInputFocus = () => {
        this.taskInput.current.focus();
    }

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newMessage: value
        });
    }

    _updateTask = () => {
        const { newMessage } = this.state;
        const { message, _updateTaskAsync } = this.props;
        this._setTaskEditingState(false);

        if (newMessage === message) {
            return null;
        } else {
            const task = this._getTaskShape({message: newMessage})

            _updateTaskAsync(task);
        }
    }

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            isTaskEditing: false,
            newMessage: message
        });
    }

    _updateTaskMessageOnKeyDown = (event) => {
        const { key } = event;
        const { newMessage } = this.state;

        if (newMessage.trim()) {
            if (key === 'Enter') {
                this._updateTask();
                return null;
            } else if (key === 'Escape') {
                this._cancelUpdatingTaskMessage()
            }
        } else {
            return null;
        }
    }

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();
            return null;
        } else {
            this._setTaskEditingState(true);
        }
    }

    _toggleTaskCompletedState = () => {
        const { completed, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({ completed: !completed })

        _updateTaskAsync(task);
    }

    _toggleTaskFavoriteState = () => {
        const { favorite, _updateTaskAsync } = this.props;
        const task = this._getTaskShape({ favorite: !favorite })

        _updateTaskAsync(task);
    }

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    }

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { message, completed, favorite } = this.props;

        const taskStyles = cx(Styles.task, {
            [Styles.completed]: completed
        })
        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className={ Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        height = { 25 }
                        inlineBlock = { true }
                        onClick = { this._toggleTaskCompletedState }
                        width = { 25 }
                    />
                    <input
                        ref = { this.taskInput }
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        type = 'text'
                        value = { newMessage }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        height = { 19 }
                        inlineBlock = { true }
                        onClick = { this._toggleTaskFavoriteState }
                        width = { 19 }
                    />
                    <Edit
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        height = {19}
                        inlineBlock = {true}
                        onClick = {this._updateTaskMessageOnClick}
                        width = {19}
                    />
                    <Remove
                        className = 'removeTask'
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        height = { 17 }
                        inlineBlock = { true }
                        onClick = { this._removeTask }
                        width = { 17 }
                    />
                </div>
            </li>
        );
    }
}
