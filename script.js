
function setPassword() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var fileToProtect = document.getElementById('fileToProtect').files[0];
    
    if (!fileToProtect) {
        alert('Please select a file to set password.');
        return;
    }

    if (password === confirmPassword) {
        sessionStorage.setItem(fileToProtect.name, password);
        alert('Password set successfully!');
    } else {
        alert('Passwords do not match!');
    }
}


function addFile() {
    return new Promise((resolve, reject) => {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.multiple = 'multiple'; // Allow multiple files to be selected
        fileInput.onchange = function() {
            const fileList = fileInput.files;

            let filesInfo = JSON.parse(localStorage.getItem('filesInfo')) || [];

            for (var i = 0; i < fileList.length; i++) {
                filesInfo.push({
                    name: fileList[i].name,
                    type: fileList[i].type,
                    size: fileList[i].size
                });
            }

            // Store the file information in localStorage
            localStorage.setItem('filesInfo', JSON.stringify(filesInfo));
            

            // Open another page
            const newWindow = window.open('9.html');
            newWindow.onload = function() {
                resolve();
            };
        };
        fileInput.click();
    });
}

addFile().then(() => {
    console.log('File selection completed');
}).catch((error) => {
    console.error(error); // Handle any errors that might occur during file selection
});

function removeLastFile() {
    var fileContainer = document.querySelector('#file-info-container');
    if (fileContainer.childNodes.length > 0) {
        // Remove the last file from the container
        fileContainer.removeChild(fileContainer.lastChild);

        // Retrieve the current filesInfo from localStorage
        let filesInfo = JSON.parse(localStorage.getItem('filesInfo')) || [];

        // Remove the last file information from filesInfo
        filesInfo.pop();

        // Update localStorage with the modified filesInfo
        localStorage.setItem('filesInfo', JSON.stringify(filesInfo));

        localStorage.removeItem('messageInfo');
    
    }
}

function checkPassword() {
    var unlockPassword = document.getElementById('unlockPassword').value;
    var fileToUnlock = document.getElementById('fileToUnlock').files[0];
    
    if (!fileToUnlock) {
        alert('Please select a file to unlock.');
        return;
    }

    var storedPassword = sessionStorage.getItem(fileToUnlock.name);
    
    if (!storedPassword) {
        alert('No password set for this file.');
        return;
    }

    if (unlockPassword === storedPassword) {
        document.getElementById('success-message').style.display='block';
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('success-message').innerHTML = document.getElementById('file-info-container').innerHTML;
       
    } else {
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
    }
}
    
function openPopup() {
    // Specify the URL and the window properties
    const url = 'popup.html'; // URL of the page you want to open in the pop-up
    const width = 800; // Width of the pop-up window
    const height =500; // Height of the pop-up window
    const left = (window.innerWidth - width) / 2; // Calculate the left position
    const top = (window.innerHeight - height) / 2; // Calculate the top position
    const options = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    // Open the pop-up window
    window.open(url, 'Pop-up Window', options);
}

function next() {
    var fileRadio = document.getElementById("fileRadio");
    var fileInput = document.getElementById("fileInput");
    var files = document.querySelector("files");
    
     if (fileRadio.checked) {
      fileInput.style.display = "block";
      addFile();
      // Process file data, for example, you could upload it to a server
    } else {
      alert("Please select File");
    }
  }
  

function displayFiles() {
    // Retrieve file information from localStorage
    const filesInfo = JSON.parse(localStorage.getItem('filesInfo'));

    // Display file information
    const fileInfoContainer = document.getElementById('file-info-container');
    fileInfoContainer.innerHTML = ''; // Clear previous content

    if (filesInfo && filesInfo.length > 0) {
        filesInfo.forEach((file, index) => {
            const fileInfoElement = document.createElement('div');
            fileInfoElement.innerHTML = `
                <strong>Name:</strong> ${file.name}, 
                <strong>Type:</strong> ${file.type}, 
                <strong>Size:</strong> ${file.size} bytes
            `;
            fileInfoContainer.appendChild(fileInfoElement);
        });
    } else {
        console.error('No file information found.');
    }
}

displayFiles();

window.addEventListener('storage', function(event) {
    if (event.key === 'filesInfo') {
        // Update the file information when the 'filesInfo' key changes
        displayFiles();
    }
});

window.addEventListener('beforeunload', function() {
    localStorage.removeItem('filesInfo'); 
});

