var tarefas = [];
function obterHoraAtual() {
    var agora = new Date();
    return agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
function adicionarTarefa() {
    var input = document.querySelector("#nova-tarefa");
    var descricao = input.value.trim();
    if (descricao !== "") {
        var nova = {
            descricao: descricao,
            concluida: false,
            horaCriacao: obterHoraAtual(),
        };
        tarefas.push(nova);
        input.value = "";
        atualizarLista();
    }
}
function marcarComoConcluida(index, marcado) {
    tarefas[index].concluida = marcado;
    atualizarLista();
}
function removerTarefa(index) {
    tarefas.splice(index, 1);
    atualizarLista();
}
function editarTarefa(index) {
    var novaDescricao = prompt("Editar tarefa:", tarefas[index].descricao);
    if (novaDescricao !== null) {
        tarefas[index].descricao = novaDescricao.trim();
        atualizarLista();
    }
}
function atualizarLista() {
    var lista = document.querySelector("#lista-tarefas");
    lista.innerHTML = "";
    tarefas.forEach(function (tarefa, index) {
        var li = document.createElement("li");
        if (tarefa.concluida)
            li.classList.add("concluida");
        var divInfo = document.createElement("div");
        divInfo.className = "tarefa-info";
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarefa.concluida;
        checkbox.classList.add("btn-check");
        checkbox.addEventListener("change", function () {
            return marcarComoConcluida(index, checkbox.checked);
        });
        var span = document.createElement("span");
        span.textContent = tarefa.descricao;
        var hora = document.createElement("time");
        hora.textContent = tarefa.horaCriacao;
        divInfo.appendChild(checkbox);
        divInfo.appendChild(span);
        divInfo.appendChild(hora);
        var btnEditar = document.createElement("button");
        btnEditar.innerHTML = "<i class=\"fas fa-pen-to-square\"></i>";
        btnEditar.className = "btn-editar";
        btnEditar.title = "Editar";
        btnEditar.addEventListener("click", function () { return editarTarefa(index); });
        var btnRemover = document.createElement("button");
        btnRemover.innerHTML = "<i class=\"fas fa-trash-alt\"></i>";
        btnRemover.className = "btn-remover";
        btnRemover.title = "Remover";
        btnRemover.addEventListener("click", function () { return removerTarefa(index); });
        li.appendChild(divInfo);
        li.appendChild(btnEditar);
        li.appendChild(btnRemover);
        lista.appendChild(li);
    });
    atualizarContador();
}
function atualizarContador() {
    var contador = document.querySelector("#contador");
    var pendentes = tarefas.filter(function (t) { return !t.concluida; }).length;
    contador.textContent = "".concat(pendentes, " tarefa(s) pendente(s)");
}
document
    .querySelector("#btn-adicionar")
    .addEventListener("click", adicionarTarefa);
