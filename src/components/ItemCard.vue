<template>
    <div class="item-card-item">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.item-card-item {
    padding: 5px 10px;
    transition: background-color .1s linear;
    margin: 5px 5px;
    background-color: #fafafa;
}
.item-card-item:active {
    background-color: aliceblue;
}
</style>
