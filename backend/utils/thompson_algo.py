from db.models import Template, TemplateICPPerformance
import numpy as np

class ThompsonSampling:
    
    def select_arm(self, templates: list[Template]):
        sampled_values = [
            np.random.beta(t.successes + 1, t.failures + 1) for t in templates
        ]

        selected_index = np.argmax(sampled_values)

        return templates[selected_index]
    
    def select_icp(self, icps: list[TemplateICPPerformance]):
        sampled_values = [
            np.random.beta(c.successes + 1, c.failures + 1) for c in icps
        ]

        selected_index = np.argmax(sampled_values)
        return icps[selected_index]

    def update(self, template: Template, icp_subset: TemplateICPPerformance, is_click=False):

        if is_click:
            template.successes += 1
            template.failures = max(0, template.failures - 1)

            icp_subset.successes += 1
            icp_subset.failures = max(0, icp_subset.failures - 1)
        else:
            template.failures += 1
            icp_subset.failures + 1
            template.total_sent += 1
            icp_subset.total_sent += 1
        return template