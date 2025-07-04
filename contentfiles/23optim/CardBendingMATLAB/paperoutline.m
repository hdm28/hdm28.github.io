%% paper outline

figure('Position', [800, 400, 600, 400]);
set(gcf,'color','w');

totwidth  = 0.210;
totlength = 0.297;

rectangle('Position', [0,0,  totlength,totwidth], 'EdgeColor', 'r');
rectangle('Position', [0.025,0.1,  totlength-0.025,0.01], 'EdgeColor', 'b');
rectangle('Position', [0,0,  0.025,totwidth], 'EdgeColor', 'b');

hold on
