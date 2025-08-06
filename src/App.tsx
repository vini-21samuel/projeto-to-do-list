import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Circle, Filter, CheckCircle2, Clock, X } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Carrega tarefas do localStorage ao inicializar a aplicação
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    }
  }, []);

  // Salva tarefas no localStorage sempre que a lista for modificada
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Função para adicionar nova tarefa
  const addTask = () => {
    const trimmedText = inputValue.trim();
    if (trimmedText === '') return;

    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: trimmedText,
      completed: false,
      createdAt: new Date()
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setInputValue('');
  };

  // Função para alternar status de conclusão da tarefa
  const toggleTask = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Função para remover tarefa individual
  const removeTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Função para limpar todas as tarefas concluídas
  const clearCompleted = () => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  // Função para lidar com a tecla Enter no input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Filtragem de tarefas baseada no filtro selecionado
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  // Contadores para estatísticas
  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header da Aplicação */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Lista de Tarefas
          </h1>
          <p className="text-gray-600">
            Organize suas atividades de forma simples e eficiente
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-orange-500 text-center mt-1">
              {pendingTasksCount}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Concluídas</span>
            </div>
            <div className="text-2xl font-bold text-green-500 text-center mt-1">
              {completedTasksCount}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-2">
              <Filter className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <div className="text-2xl font-bold text-blue-500 text-center mt-1">
              {totalTasksCount}
            </div>
          </div>
        </div>

        {/* Input para Nova Tarefa */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua nova tarefa..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={addTask}
              disabled={inputValue.trim() === ''}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 inline-flex">
            {[
              { key: 'all', label: 'Todas', icon: Filter },
              { key: 'active', label: 'Ativas', icon: Clock },
              { key: 'completed', label: 'Concluídas', icon: CheckCircle2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  filter === key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                {filter === 'all' && <Filter className="w-16 h-16 mx-auto mb-4" />}
                {filter === 'active' && <Clock className="w-16 h-16 mx-auto mb-4" />}
                {filter === 'completed' && <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />}
              </div>
              <p className="text-gray-500 text-lg">
                {filter === 'all' && 'Nenhuma tarefa criada ainda'}
                {filter === 'active' && 'Nenhuma tarefa ativa'}
                {filter === 'completed' && 'Nenhuma tarefa concluída'}
              </p>
              {filter === 'all' && (
                <p className="text-gray-400 text-sm mt-2">
                  Comece adicionando uma nova tarefa acima
                </p>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md ${
                  task.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {task.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4 opacity-0" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`text-lg transition-all duration-200 ${
                      task.completed
                        ? 'text-green-700 line-through opacity-75'
                        : 'text-gray-800'
                    }`}>
                      {task.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Criada em {task.createdAt.toLocaleDateString('pt-BR')} às {task.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeTask(task.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão para Limpar Tarefas Concluídas */}
        {completedTasksCount > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={clearCompleted}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-red-200 hover:border-red-300"
            >
              <X className="w-4 h-4" />
              <span>Limpar {completedTasksCount} tarefa{completedTasksCount > 1 ? 's' : ''} concluída{completedTasksCount > 1 ? 's' : ''}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;