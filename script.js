const form = document.getElementById("formPendaftaran");
const namaInput = document.getElementById("nama");
const jurusanInput = document.getElementById("jurusan");
const ekskulInput = document.getElementById("ekskul");
const dataList = document.getElementById("dataList");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");

let dataSiswa = JSON.parse(localStorage.getItem("dataPendaftaranEkskul")) || [];
let editIndex = -1;

function simpanKeStorage() {
  localStorage.setItem("dataPendaftaranEkskul", JSON.stringify(dataSiswa));
}

function renderData() {
  dataList.innerHTML = "";

  if (dataSiswa.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  dataSiswa.forEach((data, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(data.nama)}</td>
      <td>${escapeHTML(data.kelas)}</td>
      <td>${escapeHTML(data.jurusan)}</td>
      <td>${escapeHTML(data.ekskul)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editData(${index})">Edit</button>
          <button class="btn-delete" onclick="hapusData(${index})">Delete</button>
        </div>
      </td>
    `;

    dataList.appendChild(row);
  });
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const kelasInput = document.querySelector('input[name="kelas"]:checked');

  if (!kelasInput) {
    alert("Silakan pilih kelas.");
    return;
  }

  const dataBaru = {
    nama: namaInput.value.trim(),
    kelas: kelasInput.value,
    jurusan: jurusanInput.value,
    ekskul: ekskulInput.value
  };

  if (editIndex === -1) {
    dataSiswa.push(dataBaru);
    alert("Data berhasil ditambah");
  } else {
    dataSiswa[editIndex] = dataBaru;
    editIndex = -1;
    submitButton.textContent = "Tambah Data";
    alert("Data berhasil di edit");
  }

  simpanKeStorage();
  renderData();
  form.reset();
});

function editData(index) {
  const data = dataSiswa[index];

  namaInput.value = data.nama;
  jurusanInput.value = data.jurusan;
  ekskulInput.value = data.ekskul;

  const radio = document.querySelector(
    `input[name="kelas"][value="${CSS.escape(data.kelas)}"]`
  );
  if (radio) radio.checked = true;

  editIndex = index;
  submitButton.textContent = "Simpan Edit";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function hapusData(index) {
  const data = dataSiswa[index];

  if (confirm(`Hapus data ${data.nama}?`)) {
    dataSiswa.splice(index, 1);

    if (editIndex === index) {
      editIndex = -1;
      submitButton.textContent = "Tambah Data";
      form.reset();
    } else if (editIndex > index) {
      editIndex--;
    }

    simpanKeStorage();
    renderData();
    alert("Data berhasil di hapus");
  }
}

renderData();
