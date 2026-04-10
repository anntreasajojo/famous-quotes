document.querySelector("#closeModal").addEventListener("click", ()=> { document.querySelector("#authorModal").close();} )

       let authorLinks = document.querySelectorAll(".authorNames");
       for (let i of authorLinks) {
         i.addEventListener("click", displayAuthorInfo );
       }

       async function displayAuthorInfo(){
         let authorId = this.getAttribute("authorId");
         //alert("displaying author info..." + authorId);
         let url = "/api/author/"+authorId;
         let response = await fetch(url);
         let data = await response.json();
         //console.log(data[0].firstName);
         document.querySelector("#authorName").textContent = data[0].firstName + " " + data[0].lastName;
         document.querySelector("#authorPicture").src = data[0].portrait;

         document.querySelector("#authorDob").textContent = data[0].dob;
         document.querySelector("#authorDod").textContent = data[0].dod;
         document.querySelector("#authorSex").textContent = data[0].sex;
         document.querySelector("#authorProfession").textContent = data[0].profession;
         document.querySelector("#authorCountry").textContent = data[0].country;
         document.querySelector("#authorBiography").textContent = data[0].biography;

         //enable the modal
         document.querySelector("#authorModal").showModal();
      }