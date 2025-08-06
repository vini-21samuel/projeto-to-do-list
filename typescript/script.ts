interface Tarefa {
    descricao: string;
    concluida: boolean;
    horaCriacao: string;
  }
  
  let tarefas: Tarefa[] = [];
  
  function obterHoraAtual(): string {
    const agora = new Date();
    return agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  function adicionarTarefa(): void {
    const input = document.querySelector("#nova-tarefa") as HTMLInputElement;
    const descricao = input.value.trim();
    if (descricao !== "") {
      const nova: Tarefa = {
        descricao,
        concluida: false,
        horaCriacao: obterHoraAtual(),
      };
      tarefas.push(nova);
      input.value = "";
      atualizarLista();
    }
  }
  
  function marcarComoConcluida(index: number, marcado: boolean): void {
    tarefas[index].concluida = marcado;
    atualizarLista();
  }
  
  function removerTarefa(index: number): void {
    tarefas.splice(index, 1);
    atualizarLista();
  }
  
  function editarTarefa(index: number): void {
    const novaDescricao = prompt("Editar tarefa:", tarefas[index].descricao);
    if (novaDescricao !== null) {
      tarefas[index].descricao = novaDescricao.trim();
      atualizarLista();
    }
  }
  
  function atualizarLista(): void {
    const lista = document.querySelector("#lista-tarefas") as HTMLUListElement;
    lista.innerHTML = "";
  
    tarefas.forEach((tarefa, index) => {
      const li = document.createElement("li");
      if (tarefa.concluida) li.classList.add("concluida");
  
      const divInfo = document.createElement("div");
      divInfo.className = "tarefa-info";
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = tarefa.concluida;
      checkbox.classList.add("btn-check");
      checkbox.addEventListener("change", () =>
        marcarComoConcluida(index, checkbox.checked)
      );
  
      const span = document.createElement("span");
      span.textContent = tarefa.descricao;
  
      const hora = document.createElement("time");
      hora.textContent = tarefa.horaCriacao;
  
      divInfo.appendChild(checkbox);
      divInfo.appendChild(span);
      divInfo.appendChild(hora);
  
      const btnEditar = document.createElement("button");
      btnEditar.innerHTML = `<i class="fas fa-pen-to-square"></i>`;
      btnEditar.className = "btn-editar";
      btnEditar.title = "Editar";
      btnEditar.addEventListener("click", () => editarTarefa(index));
  
      const btnRemover = document.createElement("button");
      btnRemover.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      btnRemover.className = "btn-remover";
      btnRemover.title = "Remover";
      btnRemover.addEventListener("click", () => removerTarefa(index));
  
      li.appendChild(divInfo);
      li.appendChild(btnEditar);
      li.appendChild(btnRemover);
  
      lista.appendChild(li);
    });
  
    atualizarContador();
  }
  
  function atualizarContador(): void {
    const contador = document.querySelector("#contador") as HTMLParagraphElement;
    const pendentes = tarefas.filter((t) => !t.concluida).length;
    contador.textContent = `${pendentes} tarefa(s) pendente(s)`;
  }
  
  document
    .querySelector("#btn-adicionar")!
    .addEventListener("click", adicionarTarefa);
  