async function generate(){
    var company_name = document.getElementById("company_name").value;
    var job_role = document.getElementById("job_role").value;

    if (!company_name){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Enter a company name'
        })
        return
    }
    if (!job_role) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Enter a job role.'
        })
        return
    } 

    document.getElementById("modal-loading").style.display = "block"

    let formData = new FormData(); 
    formData.append("resume", resume.files[0]);
    formData.append("company_name", company_name);
    formData.append("job_role", job_role);
    result = await fetch('/api/generate/', {
      method: "POST", 
      body: formData,
    }).then((response) => response.json())
    .then((messages) => {
        var cover_letter = messages.data;
        document.getElementById("modal-loading").style.display = "none"
        document.getElementById("text-wrap").style.display = "block";
        document.getElementById("cover_letter").innerHTML = cover_letter;
    });
}