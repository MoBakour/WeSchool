// delete class operation
async function deleteClass(lock) {
    if (lock) return false;
    lock = true;

    const confirmed = await confirmation({
        operation: "delete-class",
        className: currentClassName,
    });
    if (!confirmed) return (lock = false);

    const fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({ classId: currentClassId }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/class/delete", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.href = "/";
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
}

// update class operation
function updateClass(lock) {
    if (lock) return false;
    lock = true;

    const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify({
            classId: currentClassId,
            newName: newClassName.value,
            newTheme: newClassTheme.value,
        }),
        headers: { "Content-Type": "application/json" },
    };

    fetch("/class/edit", fetchOptions)
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        })
        .catch((err) => console.log(err))
        .finally(() => (lock = false));
}
