import { MAIN_URL, TOKEN } from './config';

export const api = {

    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                Authorization: TOKEN
            }
        });

        if (response.status !== 200) {
            throw new Error('Tasks were not loaded');
        }

        const { data } = await response.json();

        return (data);
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: TOKEN
            },
            body: JSON.stringify({
                message
            })
        });

        if (response.status !== 200) {
            throw new Error('Task create were not loaded');
        }

        const { data } = await response.json();

        return (data);
    },

    async removeTask (taskId) {
        const response = await fetch(`${MAIN_URL}${taskId}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN
            }
        });

        if (response.status !== 204) {
            throw new Error('Task remove were not loaded');
        }
    },

    async updateTask (task) {
        const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                Authorization: TOKEN
            },
            body: JSON.stringify([
                task
            ])
        });

        if (response.status !== 200) {
            throw new Error('Task update were not loaded');
        }

        const { data } = await response.json();

        return (data);
    },

    async completeAllTasks (tasks) {
        const updatedTasks = tasks.map((task) => ({
            id: task.id,
            completed: true,
            message: task.message
        }))
        const allFetch = tasks.map((task) => (
            this.updateTask(task)
        ));
        const responses = await Promise.all(allFetch);
    }

};
