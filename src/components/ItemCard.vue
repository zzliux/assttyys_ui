<template>
    <div class="item-card-item">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.item-card-item {
    padding: 8px 10px;
    transition: background-color .1s linear;
    margin: 5px 5px;
    /* background-color: #fafafa; */
    border: 1px solid #ebeef5;
    border-radius: 5px;
    display: flex;
    justify-content: space-between
}
.item-card-item:active {
    background-color: aliceblue;
}
</style>
