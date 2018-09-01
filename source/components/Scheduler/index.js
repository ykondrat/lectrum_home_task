// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST';

import Spinner from '../Spinner';
import Task from '../Task';
import FlipMove from 'react-flip-move';
import Checkbox from '../../theme/assets/Checkbox';
import { sortTasksByGroup } from '../../instruments';

export default class Scheduler extends Component {

    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           []
    }

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const data = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(data),
                initialTasks: sortTasksByGroup(data)
            });
        } catch (e) {
            console.error(e);
        } finally {
            this._setTasksFetchingState(false);
        }
    }

    _setTasksFetchingState = (bool) => {
        this.setState({
            isTasksFetching: bool
        });
    }

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newTaskMessage: value
        });
    }

    _updateTasksFilter = (event) => {
        const { value } = event.target;
        const { initialTasks } = this.state;

        this.setState((prevState) => ({
            tasksFilter: value.toLowerCase()
        }));
    }

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        event.preventDefault();
        if (newTaskMessage.trim()) {
            try {
                this._setTasksFetchingState(true);

                const data = await api.createTask(newTaskMessage);

                this.setState((prevState) => ({
                    tasks: sortTasksByGroup([data, ...prevState.tasks]),
                    initialTasks: sortTasksByGroup([data, ...prevState.tasks]),
                    newTaskMessage: ''
                }));
            } catch (e) {
                console.error(e);
            } finally {
                this._setTasksFetchingState(false);
            }
        } else {
            return null;
        }
    }

    _removeTaskAsync = async (taskId) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(taskId);

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(tasks.filter((task) => task.id !== taskId)),
                initialTasks: sortTasksByGroup(tasks.filter((task) => task.id !== taskId))
            }));
        } catch (e) {
            console.error(e);
        } finally {
            this._setTasksFetchingState(false);
        }
    }

    _updateTaskAsync = async (task) => {
        try {
            this._setTasksFetchingState(true);

            const updatedTask = await api.updateTask(task);
            const data = updatedTask[0];

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(tasks.map((task) => task.id === data.id ? data : task)),
                initialTasks: sortTasksByGroup(tasks.map((task) => task.id === data.id ? data : task))
            }));
        } catch (e) {
            console.error(e);
        } finally {
            this._setTasksFetchingState(false);
        }
    }

    _getAllCompleted = () => {
        const { tasks } = this.state;
        const updatedTasks = tasks.filter((task) => !task.completed);

        if (updatedTasks.length) {
            return false;
        }
        return true;
    }

    _completeAllTasksAsync = async () => {
        if (!this._getAllCompleted()) {
            const { tasks } = this.state;
            const updatedTasks = tasks.filter((task) => !task.completed);

            try {
                this._setTasksFetchingState(true);
                await api.completeAllTasks(updatedTasks);

                this.setState(({ tasks }) => ({
                    tasks: sortTasksByGroup(tasks.map((task) => ({
                        id: task.id,
                        completed: true,
                        favorite: task.favorite,
                        message: task.message,
                        created: task.created
                    }))),
                    initialTasks: sortTasksByGroup(tasks.map((task) => ({
                        id: task.id,
                        completed: true,
                        favorite: task.favorite,
                        message: task.message,
                        created: task.created
                    }))),
                }));
            } catch (e) {
                console.error(e);
            } finally {
                this._setTasksFetchingState(false);
            }
        } else {
            return null
        }
    }

    render () {
        const { isTasksFetching, tasksFilter, newTaskMessage, tasks } = this.state;
        const tasksFiltered = sortTasksByGroup(tasks.filter((item) => item.message.toLowerCase().search(tasksFilter.toLowerCase()) !== -1));
        
        const tasksJSX = tasksFiltered.map((task, index) => (
            <Task
                key = { task.id }
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                completed = { task.completed }
                favorite = { task.favorite }
                id = { task.id }
                message = { task.message }
                created = { task.created }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching }/>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            onChange = { this._updateTasksFilter }
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                onChange = { this._updateNewTaskMessage }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                            />
                            <button>
                                Добавить задачу
                            </button>
                        </form>
                        <div className = "overlay">
                            <ul>
                                <FlipMove
                                    delay = { 0 }
                                    disableAllAnimations = { false }
                                    duration = { 400 }
                                    easing = 'ease-in-out'
                                    enterAnimation = 'elevator'
                                    leaveAnimation = 'elevator'
                                    maintainContainerHeight = { false }
                                    staggerDelayBy = { 0 }
                                    staggerDurationBy = { 0 }
                                    typeName = 'div'
                                    verticalAlignment = 'top'
                                >
                                    { tasksJSX }
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
